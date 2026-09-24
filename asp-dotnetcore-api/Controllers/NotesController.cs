
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
	/// Controller for Notes api
	/// </summary>
	public class NotesController:BaseController
	{
		private readonly IConfiguration Config;
		private readonly EmailHelper Mailer;
		private readonly IHttpContextAccessor HttpAccessor;
		private readonly AppDBContext DB;
		private readonly IMapper Mapper;
		private readonly IWebHostEnvironment hostEnvironment;
		private readonly Rbac rbac;
		public NotesController(AppDBContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration, EmailHelper mailer, Rbac _rbac) :base(dbContext, httpContextAccessor, environment, Configuration)
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
		/// List  Notes records
		/// Support searching, filtering and ordering of table records
		/// </summary>
		/// <param name="fieldname">Filter records based on table field.</param>
		/// <param name="fieldvalue">Filter value.</param>
   		/// <returns>JSON Array of Notes records</returns>
		[HttpGet]
		public async Task<IActionResult> Index(string? fieldname, string? fieldvalue, string? search, string? orderby, string ordertype = "desc", int page = 1, int limit = 10){
			try{
				var query = from Notes in DB.Notes
							select new Notes {
								note_id = Notes.note_id,
						related_entity_type = Notes.related_entity_type,
						related_entity_id = Notes.related_entity_id,
						title = Notes.title,
						content = Notes.content,
						created_by = Notes.created_by,
						created_at = Notes.created_at
							};
				if(search != null){
					query = query.Where(
						p => EF.Functions.Like(p.note_id.ToString(), $"%{search}%") || 
						EF.Functions.Like(p.related_entity_type, $"%{search}%") || 
						EF.Functions.Like(p.title, $"%{search}%") || 
						EF.Functions.Like(p.content, $"%{search}%") 
					);
				}
				if(orderby != null){
					bool asc = ordertype.Equals("asc", StringComparison.CurrentCultureIgnoreCase);
					query = query.OrderByField(orderby, asc);
				}
				else{
					query = query.OrderByField("note_id", false);
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
	/// Import csv file data into Notes
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
						var records = csvReader.GetRecords<Notes>().ToList();

						DB.Notes.AddRange(records);
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
		/// Select single Notes record by ID
		/// </summary>
		/// <param name="id">Table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpGet]
		[Route("api/notes/view/{id}")]
		public async Task<IActionResult> Detail(int id){
			try{
				var query = from Notes in DB.Notes
							select new Notes {
								note_id = Notes.note_id,
						related_entity_type = Notes.related_entity_type,
						related_entity_id = Notes.related_entity_id,
						title = Notes.title,
						content = Notes.content,
						created_by = Notes.created_by,
						created_at = Notes.created_at
							};
				query = query.Where(p => p.note_id.Equals(id));
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
   		/// <returns>JSON Object of newly created Notes record</returns>
		[HttpPost]
		public ActionResult Add([FromBody] NotesAddDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var modeldata = new Notes();
								modeldata.related_entity_type = postdata.related_entity_type;
				modeldata.related_entity_id = postdata.related_entity_id;
				modeldata.title = postdata.title;
				modeldata.content = postdata.content;
				modeldata.created_by = postdata.created_by;
				// save Notes record
				DB.Notes.Add(modeldata);
				var record = modeldata; //newly created record
				DB.SaveChanges();
				var recId = record.note_id; //newly created record id
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Get  Notes record for edit
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpGet]
		public ActionResult Edit(int id){
			try{
				var query = from Notes in DB.Notes
					select new Notes {
						note_id = Notes.note_id,
						related_entity_type = Notes.related_entity_type,
						related_entity_id = Notes.related_entity_id,
						title = Notes.title,
						content = Notes.content,
						created_by = Notes.created_by
					};
				query = query.Where(p => p.note_id.Equals(id));
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
		/// Update  Notes record with form data
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpPost]
		public ActionResult Edit(int id, [FromBody] NotesEditDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var query = from Notes in DB.Notes
							select Notes;
				query = query.Where(p => p.note_id.Equals(id));
				var record = query.FirstOrDefault();
				if (record == null)
				{
					return NotFound("No record found");
				}
				
				var modeldata = record;
								modeldata.related_entity_type = postdata.related_entity_type;
				modeldata.related_entity_id = postdata.related_entity_id;
				modeldata.title = postdata.title;
				modeldata.content = postdata.content;
				modeldata.created_by = postdata.created_by;
				DB.Update(modeldata);
				DB.SaveChanges();
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Delete Notes record
		/// Support multi delete by separating record id by comma.
		/// </summary>
		/// <param name="id">Record ID.</param>
   		/// <returns>Deleted Records ID</returns>
		[HttpGet]
		public ActionResult Delete(string id){
			try{
				var query = DB.Notes.AsQueryable();

				List<string> arrId = id.Split(",").ToList();
				query = query.Where(p => arrId.Contains(p.note_id.ToString()));
				DB.Notes.RemoveRange(query);
				DB.SaveChanges();
				return Ok(id);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Export  Notes records to different format such as: pdf, cvs, excel, html
		/// </summary>
   		/// <returns>PDF | CSV | Excel | HTML File</returns>
		[HttpGet]
		private async Task<IActionResult> ExportListRecords(List<Notes> records)
		{
			string exportFormat = Request.Query["export"].ToString().ToLower();
			string viewName = "ExportList"; // html template for pdf

			try{
				var fileName = "NotesReport";
				if (exportFormat == "excel" || exportFormat == "csv")
				{
					List<DataHeader> Columns = new List<DataHeader>()
					{
					    new DataHeader { Header = "Note Id", Key = "note_id" },
					    new DataHeader { Header = "Related Entity Type", Key = "related_entity_type" },
					    new DataHeader { Header = "Related Entity Id", Key = "related_entity_id" },
					    new DataHeader { Header = "Title", Key = "title" },
					    new DataHeader { Header = "Content", Key = "content" },
					    new DataHeader { Header = "Created By", Key = "created_by" },
					    new DataHeader { Header = "Created At", Key = "created_at" }
					};
					var dataTable = records.ToDataTable(Columns);
					dataTable.TableName = "Notes"; // Excel worksheet title
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
		/// Export  Notes records to different format such as: pdf, cvs, excel, html
		/// </summary>
   		/// <returns>PDF | CSV | Excel | HTML File</returns>
		[HttpGet]
		private async Task<IActionResult> ExportViewRecords(List<Notes> records)
		{
			string exportFormat = Request.Query["export"].ToString().ToLower();
			string viewName = "ExportView"; // html template for pdf

			try{
				var fileName = "NotesReport";
				if (exportFormat == "excel" || exportFormat == "csv")
				{
					List<DataHeader> Columns = new List<DataHeader>()
					{
					    new DataHeader { Header = "Note Id", Key = "note_id" },
					    new DataHeader { Header = "Related Entity Type", Key = "related_entity_type" },
					    new DataHeader { Header = "Related Entity Id", Key = "related_entity_id" },
					    new DataHeader { Header = "Title", Key = "title" },
					    new DataHeader { Header = "Content", Key = "content" },
					    new DataHeader { Header = "Created By", Key = "created_by" },
					    new DataHeader { Header = "Created At", Key = "created_at" }
					};
					var dataTable = records.ToDataTable(Columns);
					dataTable.TableName = "Notes"; // Excel worksheet title
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
