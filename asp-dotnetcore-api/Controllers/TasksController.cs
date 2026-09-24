
#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8629 // Nullable value type may be null.
namespace ASPRad.Controller{
	using System;
	using Microsoft.AspNetCore.Mvc;
	using System.Collections.Generic;
	using Microsoft.Extensions.Logging;
	using System.Linq;
	using CsvHelper;
    using System.IO;
	using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
	using Microsoft.AspNetCore.Hosting;
	using ASPRad.Models;
	using ASPRad.Helpers;
	using Microsoft.EntityFrameworkCore;
	using System.Linq.Dynamic.Core;
    using Microsoft.Extensions.Configuration;
	using AutoMapper;
	using WkWrap.Core;
    using System.Text;

	using Microsoft.AspNetCore.Authorization;

	

	/// <summary>
	/// Controller for Tasks api
	/// </summary>
	public class TasksController:BaseController
	{
		private readonly IConfiguration Config;
		private readonly EmailHelper Mailer;
		private readonly IHttpContextAccessor HttpAccessor;
		private readonly AppDBContext DB;
		private readonly IMapper Mapper;
		private readonly IWebHostEnvironment hostEnvironment;
		private readonly Rbac rbac;
		public TasksController(AppDBContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration, EmailHelper mailer, Rbac _rbac) :base(dbContext, httpContextAccessor, environment, Configuration)
		{
			Config = Configuration;
			Mailer = mailer;
			HttpAccessor = httpContextAccessor;
			DB = dbContext;
			Mapper = mapper;
			hostEnvironment = environment;
			rbac = _rbac;
		}
		

		/// <summary>
		/// List  Tasks records
		/// Support searching, filtering and ordering of table records
		/// </summary>
		/// <param name="fieldname">Filter records based on table field.</param>
		/// <param name="fieldvalue">Filter value.</param>
   		/// <returns>JSON Array of Tasks records</returns>
		[HttpGet]
		public async Task<IActionResult> Index(string? fieldname, string? fieldvalue, string? search, string? orderby, string ordertype = "desc", int page = 1, int limit = 10){
			try{
				var query = from Tasks in DB.Tasks
							select new Tasks {
								task_id = Tasks.task_id,
						title = Tasks.title,
						description = Tasks.description,
						related_entity_type = Tasks.related_entity_type,
						related_entity_id = Tasks.related_entity_id,
						assigned_user_id = Tasks.assigned_user_id,
						priority_id = Tasks.priority_id,
						due_date = Tasks.due_date,
						task_status_id = Tasks.task_status_id,
						reminder_date = Tasks.reminder_date,
						completed_at = Tasks.completed_at,
						created_at = Tasks.created_at,
						updated_at = Tasks.updated_at,
						date_created = Tasks.date_created,
						date_updated = Tasks.date_updated
							};
				if(search != null){
					query = query.Where(
						p => EF.Functions.Like(p.task_id.ToString(), $"%{search}%") || 
						EF.Functions.Like(p.title, $"%{search}%") || 
						EF.Functions.Like(p.description, $"%{search}%") || 
						EF.Functions.Like(p.related_entity_type, $"%{search}%") 
					);
				}
				if(orderby != null){
					bool asc = ordertype.Equals("asc", StringComparison.CurrentCultureIgnoreCase);
					query = query.OrderByField(orderby, asc);
				}
				else{
					query = query.OrderByField("task_id", false);
				}
				if(fieldvalue != null)
				{
					// filter record by table field
					query = query.Where(fieldname + " == @0", fieldvalue);
				}
				// export page records
				if (Request.Query.ContainsKey("export")){
					var exportRecords = query.ToList();
					return await ExportListRecords(exportRecords);
				}

				int totalRecords = query.Count();
				int offset = ((page - 1) * limit);
				var records = query.Skip(offset).Take(limit).ToList();
				int recordCount = records.Count;
				double t = totalRecords / limit;
				int totalPages = (int)Math.Ceiling(t);
				var result = new { records, totalRecords, recordCount, totalPages};
				return Ok(result);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
	

	/// <summary>
	/// Import csv file data into Tasks
	/// </summary>
	/// <returns>Number of records imported</returns>
	public ActionResult ImportData([FromForm(Name = "file")] List<IFormFile> CsvFiles)
	{
		try
		{
			int totalRows = 0;
			foreach (IFormFile file in CsvFiles)
			{
				if (file.Length > 0) // ensures file has readable content
				{
					string fileName = Path.GetFileName(file.FileName);
					string ext = Path.GetExtension(fileName).Trim('.').ToLower();
					if (ext != "csv")
					{
						return BadRequest(ext + " files not allowed");
					}
					using (var memoryStream = new MemoryStream())
					{
						file.CopyTo(memoryStream);
						memoryStream.Position = 0;

						TextReader textReader = new StreamReader(memoryStream);
						var config = new CsvHelper.Configuration.CsvConfiguration(System.Globalization.CultureInfo.InvariantCulture)
						{
							HasHeaderRecord = true,
						};

						var csvReader = new CsvReader(textReader, config);
						var records = csvReader.GetRecords<Tasks>().ToList();

						DB.Tasks.AddRange(records);
						DB.SaveChanges();
						totalRows +=  records.Count;
					}
				}
			}
			return Ok(totalRows + " Records Imported");
		}
		catch (Exception ex)
		{
			return ServerError(ex);
		}
	}
		

		/// <summary>
		/// Select single Tasks record by ID
		/// </summary>
		/// <param name="id">Table primary key.</param>
   		/// <returns>JSON Object of Tasks record</returns>
		[HttpGet]
		[Route("api/tasks/view/{id}")]
		public async Task<IActionResult> Detail(int id){
			try{
				var query = from Tasks in DB.Tasks
							select new Tasks {
								task_id = Tasks.task_id,
						title = Tasks.title,
						description = Tasks.description,
						related_entity_type = Tasks.related_entity_type,
						related_entity_id = Tasks.related_entity_id,
						assigned_user_id = Tasks.assigned_user_id,
						priority_id = Tasks.priority_id,
						due_date = Tasks.due_date,
						task_status_id = Tasks.task_status_id,
						reminder_date = Tasks.reminder_date,
						completed_at = Tasks.completed_at,
						created_at = Tasks.created_at,
						updated_at = Tasks.updated_at,
						date_created = Tasks.date_created,
						date_updated = Tasks.date_updated
							};
				query = query.Where(p => p.task_id.Equals(id));
				// export page records
				if (Request.Query.ContainsKey("export")){
					var exportRecords = query.ToList();
					return await ExportViewRecords(exportRecords);
				}

				var record = query.FirstOrDefault();
				if (record == null )
				{
					return NotFound("No record found");
				}
				
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Save form record to the  table
		/// </summary>
   		/// <returns>JSON Object of newly created Tasks record</returns>
		[HttpPost]
		public ActionResult Add([FromBody] TasksAddDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var modeldata = new Tasks();
								modeldata.title = postdata.title;
				modeldata.description = postdata.description;
				modeldata.related_entity_type = postdata.related_entity_type;
				modeldata.related_entity_id = postdata.related_entity_id;
				modeldata.assigned_user_id = postdata.assigned_user_id;
				modeldata.priority_id = postdata.priority_id;
				modeldata.due_date = postdata.due_date;
				modeldata.task_status_id = postdata.task_status_id;
				modeldata.reminder_date = postdata.reminder_date;
				modeldata.completed_at = postdata.completed_at;
				modeldata.date_created = DateTime.Now;
				modeldata.date_updated = DateTime.Now;
				// save Tasks record
				DB.Tasks.Add(modeldata);
				var record = modeldata; //newly created record
				DB.SaveChanges();
				var recId = record.task_id; //newly created record id
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Get  Tasks record for edit
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Tasks record</returns>
		[HttpGet]
		public ActionResult Edit(int id){
			try{
				var query = from Tasks in DB.Tasks
					select new Tasks {
						task_id = Tasks.task_id,
						title = Tasks.title,
						description = Tasks.description,
						related_entity_type = Tasks.related_entity_type,
						related_entity_id = Tasks.related_entity_id,
						assigned_user_id = Tasks.assigned_user_id,
						priority_id = Tasks.priority_id,
						due_date = Tasks.due_date,
						task_status_id = Tasks.task_status_id,
						reminder_date = Tasks.reminder_date,
						completed_at = Tasks.completed_at
					};
				query = query.Where(p => p.task_id.Equals(id));
				var record = query.FirstOrDefault();
				if (record == null)
				{
					return NotFound("No record found");
				}
				
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}

		

		/// <summary>
		/// Update  Tasks record with form data
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Tasks record</returns>
		[HttpPost]
		public ActionResult Edit(int id, [FromBody] TasksEditDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var query = from Tasks in DB.Tasks
							select Tasks;
				query = query.Where(p => p.task_id.Equals(id));
				var record = query.FirstOrDefault();
				if (record == null)
				{
					return NotFound("No record found");
				}
				
				var modeldata = record;
								modeldata.title = postdata.title;
				modeldata.description = postdata.description;
				modeldata.related_entity_type = postdata.related_entity_type;
				modeldata.related_entity_id = postdata.related_entity_id;
				modeldata.assigned_user_id = postdata.assigned_user_id;
				modeldata.priority_id = postdata.priority_id;
				modeldata.due_date = postdata.due_date;
				modeldata.task_status_id = postdata.task_status_id;
				modeldata.reminder_date = postdata.reminder_date;
				modeldata.completed_at = postdata.completed_at;
				modeldata.date_updated = DateTime.Now;
				DB.Update(modeldata);
				DB.SaveChanges();
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Delete Tasks record
		/// Support multi delete by separating record id by comma.
		/// </summary>
		/// <param name="id">Record ID.</param>
   		/// <returns>Deleted Records ID</returns>
		[HttpGet]
		public ActionResult Delete(string id){
			try{
				var query = DB.Tasks.AsQueryable();

				List<string> arrId = id.Split(",").ToList();
				query = query.Where(p => arrId.Contains(p.task_id.ToString()));
				DB.Tasks.RemoveRange(query);
				DB.SaveChanges();
				return Ok(id);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Export  Tasks records to different format such as: pdf, cvs, excel, html
		/// </summary>
   		/// <returns>PDF | CSV | Excel | HTML File</returns>
		[HttpGet]
		private async Task<IActionResult> ExportListRecords(List<Tasks> records)
		{
			string exportFormat = Request.Query["export"].ToString().ToLower();
			string viewName = "ExportList"; // html template for pdf

			try{
				var fileName = "TasksReport";
				if (exportFormat == "excel" || exportFormat == "csv")
				{
					List<DataHeader> Columns = new List<DataHeader>()
					{
					    new DataHeader { Header = "Task Id", Key = "task_id" },
					    new DataHeader { Header = "Title", Key = "title" },
					    new DataHeader { Header = "Description", Key = "description" },
					    new DataHeader { Header = "Related Entity Type", Key = "related_entity_type" },
					    new DataHeader { Header = "Related Entity Id", Key = "related_entity_id" },
					    new DataHeader { Header = "Assigned User Id", Key = "assigned_user_id" },
					    new DataHeader { Header = "Priority Id", Key = "priority_id" },
					    new DataHeader { Header = "Due Date", Key = "due_date" },
					    new DataHeader { Header = "Task Status Id", Key = "task_status_id" },
					    new DataHeader { Header = "Reminder Date", Key = "reminder_date" },
					    new DataHeader { Header = "Completed At", Key = "completed_at" },
					    new DataHeader { Header = "Created At", Key = "created_at" },
					    new DataHeader { Header = "Updated At", Key = "updated_at" },
					    new DataHeader { Header = "Date Created", Key = "date_created" },
					    new DataHeader { Header = "Date Updated", Key = "date_updated" }
					};
					var dataTable = records.ToDataTable(Columns);
					dataTable.TableName = "Tasks"; // Excel worksheet title
					return ExportToExcel(dataTable, fileName, exportFormat);
				}
				else if (exportFormat == "pdf")
				{
					var htmlContent = await this.RenderViewAsync(viewName, records, true);
					var wkhtmltoExePath = Config["WKHTML_EXE_PATH"];
					var wkhtmltopdf = new FileInfo(wkhtmltoExePath);
					var converter = new HtmlToPdfConverter(wkhtmltopdf);
					var settings = new ConversionSettings(pageSize: PageSize.A3, orientation: PageOrientation.Portrait, enableExternalLinks: true, enableImages: true);
					var pdfBytes = converter.ConvertToPdf(htmlContent, Encoding.UTF8, settings);
					return File(pdfBytes, "application/pdf", $"{fileName}.pdf");
				}
				else if (exportFormat == "print")
				{
					return View(viewName, records);
				}
				return BadRequest("Export Format not Supported");
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Export  Tasks records to different format such as: pdf, cvs, excel, html
		/// </summary>
   		/// <returns>PDF | CSV | Excel | HTML File</returns>
		[HttpGet]
		private async Task<IActionResult> ExportViewRecords(List<Tasks> records)
		{
			string exportFormat = Request.Query["export"].ToString().ToLower();
			string viewName = "ExportView"; // html template for pdf

			try{
				var fileName = "TasksReport";
				if (exportFormat == "excel" || exportFormat == "csv")
				{
					List<DataHeader> Columns = new List<DataHeader>()
					{
					    new DataHeader { Header = "Task Id", Key = "task_id" },
					    new DataHeader { Header = "Title", Key = "title" },
					    new DataHeader { Header = "Description", Key = "description" },
					    new DataHeader { Header = "Related Entity Type", Key = "related_entity_type" },
					    new DataHeader { Header = "Related Entity Id", Key = "related_entity_id" },
					    new DataHeader { Header = "Assigned User Id", Key = "assigned_user_id" },
					    new DataHeader { Header = "Priority Id", Key = "priority_id" },
					    new DataHeader { Header = "Due Date", Key = "due_date" },
					    new DataHeader { Header = "Task Status Id", Key = "task_status_id" },
					    new DataHeader { Header = "Reminder Date", Key = "reminder_date" },
					    new DataHeader { Header = "Completed At", Key = "completed_at" },
					    new DataHeader { Header = "Created At", Key = "created_at" },
					    new DataHeader { Header = "Updated At", Key = "updated_at" },
					    new DataHeader { Header = "Date Created", Key = "date_created" },
					    new DataHeader { Header = "Date Updated", Key = "date_updated" }
					};
					var dataTable = records.ToDataTable(Columns);
					dataTable.TableName = "Tasks"; // Excel worksheet title
					return ExportToExcel(dataTable, fileName, exportFormat);
				}
				else if (exportFormat == "pdf")
				{
					var htmlContent = await this.RenderViewAsync(viewName, records, true);
					var wkhtmltoExePath = Config["WKHTML_EXE_PATH"];
					var wkhtmltopdf = new FileInfo(wkhtmltoExePath);
					var converter = new HtmlToPdfConverter(wkhtmltopdf);
					var settings = new ConversionSettings(pageSize: PageSize.A3, orientation: PageOrientation.Portrait, enableExternalLinks: true, enableImages: true);
					var pdfBytes = converter.ConvertToPdf(htmlContent, Encoding.UTF8, settings);
					return File(pdfBytes, "application/pdf", $"{fileName}.pdf");
				}
				else if (exportFormat == "print")
				{
					return View(viewName, records);
				}
				return BadRequest("Export Format not Supported");
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}

		
	}
}
