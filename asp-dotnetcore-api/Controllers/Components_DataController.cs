
#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8629 // Nullable value type may be null.
namespace ASPRad.Controller{
	using System;
	using Microsoft.AspNetCore.Mvc;
	using System.Collections.Generic;
	using System.Linq;
    using Microsoft.AspNetCore.Http;
	using Microsoft.AspNetCore.Hosting;
	using System.Linq.Dynamic.Core;
	using ASPRad.Models;
	using ASPRad.Helpers;
    using Microsoft.Extensions.Configuration;
	using Microsoft.EntityFrameworkCore;
	

	/// <summary>
	/// Components Data Controller
	/// </summary>
	using Microsoft.AspNetCore.Authorization;
    [AllowAnonymous]
	public class Components_Data:BaseController
	{
		private readonly IConfiguration Config;
		private readonly AppDBContext DB;
		private readonly IWebHostEnvironment hostEnvironment;
		public Components_Data(AppDBContext dbContext, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration) :base(dbContext, httpContextAccessor, environment, Configuration)
		{
			DB = dbContext;
			Config = Configuration;
			hostEnvironment = environment;
		}
	

	/// <summary>
	/// Get created_by_option_list records
	/// </summary>
	/// <returns>Array of option labels and value object</returns>
	[HttpGet]
	public ActionResult created_by_option_list()
	{
		string sqlText = "SELECT user_id as value, title as label FROM dbo.users" ;
		var queryParams = new List<QueryParam>();
		var records =  DB.RawSqlQuery(sqlText, queryParams,
			record => new {
				value = record["value"],
				label = record["label"]
			}
		);
		return Ok(records) ;
	}

	

	/// <summary>
	/// Get priority_id_option_list records
	/// </summary>
	/// <returns>Array of option labels and value object</returns>
	[HttpGet]
	public ActionResult priority_id_option_list()
	{
		string sqlText = "SELECT priority_id as value, priority_name as label FROM dbo.task_priorities" ;
		var queryParams = new List<QueryParam>();
		var records =  DB.RawSqlQuery(sqlText, queryParams,
			record => new {
				value = record["value"],
				label = record["label"]
			}
		);
		return Ok(records) ;
	}

	

	/// <summary>
	/// Get task_status_id_option_list records
	/// </summary>
	/// <returns>Array of option labels and value object</returns>
	[HttpGet]
	public ActionResult task_status_id_option_list()
	{
		string sqlText = "SELECT task_status_id as value, status_name as label FROM dbo.task_statuses" ;
		var queryParams = new List<QueryParam>();
		var records =  DB.RawSqlQuery(sqlText, queryParams,
			record => new {
				value = record["value"],
				label = record["label"]
			}
		);
		return Ok(records) ;
	}

	

	/// <summary>
	/// check if field value already exist in a Users table
	/// </summary>
	/// <param name="id">value to check if exists in a table records.</param>
	/// <returns>True or False</returns>
	[HttpGet]
	public ActionResult users_email_exist(string id = ""){
		bool exist = DB.Users.Any(p => p.email == id);
		if(exist == true){
			return Ok("true");
		}
		return Ok("false") ;
	}

	

	/// <summary>
	/// check if field value already exist in a Users table
	/// </summary>
	/// <param name="id">value to check if exists in a table records.</param>
	/// <returns>True or False</returns>
	[HttpGet]
	public ActionResult users_username_exist(string id = ""){
		bool exist = DB.Users.Any(p => p.username == id);
		if(exist == true){
			return Ok("true");
		}
		return Ok("false") ;
	}
	}
}
