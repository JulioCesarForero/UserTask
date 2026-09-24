
#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8629 // Nullable value type may be null.
namespace ASPRad.Controller{
	using System;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.Extensions.Logging;
	using System.Linq;
	using System.Linq.Dynamic.Core;
    using Microsoft.AspNetCore.Http;
	using Microsoft.AspNetCore.Hosting;
	using ASPRad.Models;
	using AutoMapper;
    using Microsoft.Extensions.Configuration;
	

	/// <summary>
	/// User Account Controller
	/// </summary>
	public class AccountController:BaseController{
		private readonly IConfiguration Config;
		private readonly EmailHelper Mailer;
		private readonly AppDBContext DB;
		private IQueryable<Users> Query;
		private readonly IMapper Mapper;
		private readonly IWebHostEnvironment hostEnvironment;
		public AccountController(AppDBContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration, EmailHelper mailer) :base(dbContext, httpContextAccessor, environment, Configuration)
		{
			Config = Configuration;
			Mailer = mailer;
			DB = dbContext;
			Query = DB.Users;
			Mapper = mapper;
			hostEnvironment = environment;
		}
		

		/// <summary>
		/// Route to view  user account detail
		/// </summary>
   		/// <returns>JSON Object of Users record</returns>
		[HttpGet]
		public ActionResult Index(){
			var id = CurrentUser.user_id;
			try{
				var query = from Users in DB.Users
					select new Users{
						title = Users.title,
						first_name = Users.first_name,
						last_name = Users.last_name,
						email = Users.email,
						phone = Users.phone,
						username = Users.username,
						user_id = Users.user_id
					};
				query = query.Where(p => p.user_id.Equals(id)); // filter by current user id
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
		/// Get  user account record for edit
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Users record</returns>
		[HttpGet]
		public ActionResult Edit(){
			try{
				var id = CurrentUser.user_id;
				var query = from Users in DB.Users
					select new Users {
						title = Users.title,
						first_name = Users.first_name,
						last_name = Users.last_name,
						phone = Users.phone,
						username = Users.username,
						user_id = Users.user_id
					};
				query = query.Where(p => p.user_id.Equals(id));  // filter by current user id
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
		/// Update  user account record with form data
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Users record</returns>
		[HttpPost]
		public ActionResult Edit([FromBody] UsersAccounteditDTO postdata){
			var id = CurrentUser.user_id;
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var query = from Users in DB.Users
							select Users;
				query = query.Where(p => p.user_id.Equals(id));  // filter by current user id
				var record = query.FirstOrDefault();

				if (record == null)
				{
					return NotFound("No record found");
				}
				
				// map and update current record with form data
				var modeldata = record;
								modeldata.title = postdata.title;
				modeldata.first_name = postdata.first_name;
				modeldata.last_name = postdata.last_name;
				modeldata.phone = postdata.phone;
				modeldata.username = postdata.username;
				DB.Update(modeldata);
				DB.SaveChanges();
				return Ok(record);
			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		public ActionResult CurrentUserData()
		{
			if(CurrentUser != null){
				CurrentUser.password = "";
				return Ok(CurrentUser);
			}
			return NotFound("User not found");
		}
		

		/// <summary>
		/// Change user account password
		/// </summary>
		/// <param name="modeldata">Request form data.</param>
   		/// <returns>JSON Object of Users record</returns>
		[HttpPost]
		public ActionResult ChangePassword([FromBody] ChangePassword modeldata){
			try
			{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				Query = Query.Where(p => p.user_id.Equals(CurrentUser.user_id));
				var user = Query.FirstOrDefault();
				if(user != null ){
					if(!Hash.Verify(user.password, modeldata.OldPassword)){
						return BadRequest("Current password is incorrect");
					}
					user.password = Hash.ComputeHash(modeldata.NewPassword);;
					DB.Update(user);
					DB.SaveChanges();
					return Ok();
				}
				else{
					return NotFound("No record found");
				}
			}
			catch(Exception ex)
			{
				return ServerError(ex);
			}
		}

	}
}
