using System.Linq;
using System;

using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ASPRad.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using System.Data;
using System.IO;
using Microsoft.Extensions.Configuration;
using ASPRad.Helpers;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[AuthorizeRole]
public class BaseController : Controller
{

	
	public Users CurrentUser = null!;
	private readonly AppDBContext DB;
	private readonly IHttpContextAccessor HttpAccessor;
	private readonly IWebHostEnvironment hostEnvironment;
	private readonly IConfiguration Config;
	public BaseController(AppDBContext dbContext, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration)
	{
		DB = dbContext;
		HttpAccessor = httpContextAccessor;
		hostEnvironment = environment;
		Config = Configuration;
		try{
			var User = httpContextAccessor.HttpContext.User;
			if (User.Identity.IsAuthenticated)
			{
				var userid = int.Parse(User.FindFirstValue(ClaimTypes.Name));
				CurrentUser = DB.Users.Where(p => p.user_id.Equals(userid)).FirstOrDefault();
			}
		}
		catch(Exception ex)
		{
			Console.WriteLine(ex);
		}
	}

	

	public ObjectResult ServerError(Exception ex)
	{
		//log exception
		Console.WriteLine("\n============================== Stack trace ==============================\n");
		Console.WriteLine(ex);
		Console.WriteLine("\n============================== End of Stack trace =======================\n");
		return StatusCode(500, ex.Message);
	}

	public async Task<FileMetaInfo> MoveUploadedFiles(string files, string fieldname)
	{
		var uploader = new ASPRad.Controller.FileUploaderController(hostEnvironment, Config);
		var uploadedFilesPath = uploader.MoveUploadedFiles(files, fieldname);

		//for multiple files, use the first file to get file meta info
		var firstFilePath = uploadedFilesPath.Split(",").First();
		var file = Path.Combine(hostEnvironment.WebRootPath, firstFilePath);

		string fileName = Path.GetFileName(firstFilePath);
		string fileExt = Path.GetExtension(fileName).TrimStart('.').ToLower();
		string fileType = fileExt;

		var fileInfo = new FileMetaInfo();
		fileInfo.filepath = uploadedFilesPath;
		fileInfo.filename = fileName;
		fileInfo.fileext = fileExt;
		fileInfo.filetype = fileType;

		if (System.IO.File.Exists(file))
		{
			FileInfo fi = new FileInfo(file);

			fileInfo.bytes = await System.IO.File.ReadAllBytesAsync(file);
			fileInfo.filesize = fi.Length.ToString();
		}

		return fileInfo;
	}
	public void DeleteRecordFiles(string filePath, string fieldName)
	{
		try
		{
			var filesToBeDeleted = filePath.Split(",").ToList();

			var UploadSettings = Config.GetSection("UploadSettings:" + fieldName).Get<UploadModel>();
			var imgThumbDirs = UploadSettings.imageResize.Select(a => a.name).ToList();
			var imgExts = new List<string> { "jpg", "png", "jpeg" };
			foreach (var file in filesToBeDeleted)
			{
				string fullPath = Path.Combine(hostEnvironment.WebRootPath, file);
				if (System.IO.File.Exists(fullPath))
				{
					System.IO.File.Delete(fullPath);
					string fileExt = Path.GetExtension(fullPath).Trim('.').ToLower();
					if (imgExts.Contains(fileExt))
					{
						foreach (var thumbDir in imgThumbDirs)
						{
							var paths = fullPath.Split("/").ToList();
							var lastpath = paths.Count - 1;
							paths.Insert(lastpath, thumbDir);
							var thumbFullPath = String.Join("/", paths);
							if (System.IO.File.Exists(thumbFullPath))
							{
								System.IO.File.Delete(thumbFullPath);
							}
						}
					}
				}
			}
		}
		catch (Exception err)
		{
			Console.WriteLine(err.Message);
		}
	}

	public FileResult ExportToExcel(DataTable dataTable, string fileName, string format)
	{
		if (format == "excel")
		{
			var excelContent = dataTable.ToExcel();
			var mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			return File(excelContent, mimeType, $"{fileName}.xlsx");
		}
		else
		{
			var csvText = dataTable.ToCsv();
			var mimeType = "text/csv";
			return File(csvText, mimeType, $"{fileName}.csv");
		}
	}
}