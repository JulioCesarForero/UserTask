
#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8629 // Nullable value type may be null.
namespace ASPRad.Controller{
	using System;
	using System.Text;
	using Microsoft.AspNetCore.Mvc;
	using System.Collections.Generic;
	using System.Linq;
	using ASPRad.Models;
	using ASPRad.Helpers;
	using Microsoft.Extensions.Configuration;
	using System.Linq.Dynamic.Core;
	using System.Security.Claims;
	using Microsoft.AspNetCore.Authentication.JwtBearer;
	using Microsoft.IdentityModel.Tokens;
	using System.IdentityModel.Tokens.Jwt;
	using Microsoft.AspNetCore.Authentication;  
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Http;
	using Microsoft.AspNetCore.Hosting;
	using AutoMapper;
	using System.Threading.Tasks;
	

	/// <summary>
	/// Auth Controller
	/// </summary>
	[AllowAnonymous]        
	public class AuthController:BaseController{
		private readonly AppDBContext DB;
		private readonly EmailHelper Mailer;
		private IConfiguration Config;
		private readonly IMapper Mapper;
		private readonly IWebHostEnvironment hostEnvironment;
		private readonly IHttpContextAccessor HttpAccessor;
		public AuthController(AppDBContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration, EmailHelper mailer ) :base(dbContext, httpContextAccessor, environment, Configuration)
		{
			Config = Configuration;
			DB = dbContext;
			hostEnvironment = environment;
			HttpAccessor = httpContextAccessor;
			Mailer = mailer;
			Mapper = mapper;
		}
		

		/// <summary>
		/// Authenticate and login user
		/// </summary>
		/// <param name="modeldata">Mapped Form Data to LoginModel.</param>
   		/// <returns>JSON Object of Users record</returns>
		[HttpPost]
		public ActionResult Login([FromBody] LoginModel modeldata){
			var username = modeldata.Username;
			var password = modeldata.Password;
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				
				var user = DB.Users.Where(p => p.username == username || p.email == username).FirstOrDefault();
				if(user == null)
				{ //user not found
					return Unauthorized("Username or password not correct");
				}
				
				if(!Hash.Verify(user.password, password))
				{ //password not correct
					return Unauthorized("Username or password not correct");
				}
				
				var userLoginData = GetUserLoginData(user);
				return Ok(userLoginData);

			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Save new user record
		/// </summary>
   		/// <returns>JSON Object of Users record</returns>
		public ActionResult Register([FromBody] UsersRegisterDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var modeldata = new Users();
								modeldata.email = postdata.email;
				modeldata.phone = postdata.phone;
				modeldata.username = postdata.username;
				modeldata.password = postdata.password;
				modeldata.password = Hash.ComputeHash(postdata.password);
				
				// assign default role to user
				var roleId = DB.Roles.Where(p => p.role_name == "Admin").Select(p => p.role_id).FirstOrDefault();
				modeldata.user_role_id = roleId;

				DB.Users.Add(modeldata);
				DB.SaveChanges();
				
				var user = modeldata; // newly created user
				
				var userLoginData = GetUserLoginData(user);
				return Ok(userLoginData);

			}
			catch (Exception ex){
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Send password reset link to user email
		/// </summary>
		/// <param name="modeldata">Mapped Form Data to ForgotPassword Model.</param>
   		/// <returns>Success message</returns>
		[HttpPost]
		public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword modeldata){
			try
			{
				if(!ModelState.IsValid){
					return BadRequest(ModelState);
				}

				var email = modeldata.Email;
				var user = DB.Users.Where(p => p.email.Equals(email)).FirstOrDefault();
				if(user == null)
				{
					return NotFound("Email not registered");
				}

				var token = GenerateUserToken(user);
				var siteAddr = Config["FRONTEND_URL"];
				var resetlink = $"{siteAddr}/index/resetpassword?token={token}";
				var sitename = Config["SITE_NAME"];

				ViewBag.username = user.username;
				ViewBag.sitename = Config["SITE_NAME"];
				ViewBag.resetlink = resetlink;

				var mailtitle = "Password reset";
				var mailbody = await this.RenderViewAsync("PasswordResetTemplate", "");
				Mailer.SendEmail(email, mailtitle, mailbody);
				return Ok("We have emailed your password reset link!");
			}
			catch(Exception ex)
			{
				return ServerError(ex);
			}
		}

		

		/// <summary>
		/// Reset user password
		/// </summary>
		/// <param name="id">Reset link token.</param>
		/// <param name="modeldata">Mapped Form Data to ForgotPassword Model.</param>
   		/// <returns>Success message</returns>
		[HttpPost]
		public ActionResult ResetPassword([FromBody] ResetPassword modeldata){
			try
			{
				if(!ModelState.IsValid){
					return BadRequest(ModelState);
				}

				var userid = GetUserIDFromJwt(modeldata.Token);
				var user = DB.Users.Where(p => p.user_id.ToString().Equals(userid)).FirstOrDefault();;

				if (user == null)
				{
					return BadRequest("Invalid Token");
				}
				user.password = Hash.ComputeHash(modeldata.Password);
				DB.Update(user);
				DB.SaveChanges();
				return Ok(new { message = "Password reset completed" });
			}
			catch(Exception ex)
			{
				return ServerError(ex);
			}
		}
		

		/// <summary>
		/// Return user login data
		/// </summary>
		/// <param name="user">User data.</param>
   		/// <returns>User data and token</returns>
		private object GetUserLoginData(Users user){
			var token = GenerateUserToken(user);
			return  new { token };
		}
		

		/// <summary>
		/// Generate JWT token
		/// </summary>
		/// <param name="user">User data.</param>
		/// <param name="expiresInMins">Token expiration duration.</param>
   		/// <returns>JWT</returns>
		private string GenerateUserToken(Users user)    
		{
			var expiresInMins = double.Parse(Config["Jwt:Duration"]); 
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]));    
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);    
			var claims = new List<Claim> {  
				new Claim(JwtRegisteredClaimNames.Sub, Config["Jwt:Subject"]),
				new Claim(ClaimTypes.Name, user.user_id.ToString()),
			};
			claims.Add(new Claim(ClaimTypes.Role, user.user_role_id.ToString()));

			var token = new JwtSecurityToken(Config["Jwt:Issuer"],    
				Config["Jwt:Issuer"],    
				claims,    
				expires: DateTime.Now.AddMinutes(expiresInMins),    
				signingCredentials: credentials);
			return new JwtSecurityTokenHandler().WriteToken(token);    
		}

		

		/// <summary>
		/// Validate JWT token
		/// </summary>
		/// <param name="jwt">Jwt string to validate.</param>
   		/// <returns>Valid token data</returns>
		private JwtSecurityToken ValidateToken(string jwt)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]));
			var validationParameters = new TokenValidationParameters
			{
				// Clock skew compensates for server time drift.
				// We recommend 5 minutes or less:
				ClockSkew = TimeSpan.FromMinutes(5),
				IssuerSigningKey = securityKey,
				RequireSignedTokens = true,
				RequireExpirationTime = true,
				ValidateLifetime = true,
				ValidateAudience = true,
				ValidAudience = Config["Jwt:Issuer"],
				ValidateIssuer = true,
				ValidIssuer = Config["Jwt:Issuer"]
			};
			try
			{
				var claimsPrincipal = new JwtSecurityTokenHandler().ValidateToken(jwt, validationParameters, out var rawValidatedToken);
				return (JwtSecurityToken)rawValidatedToken;
			}
			catch (SecurityTokenValidationException stvex)
			{
				throw new Exception($"Token failed validation: {stvex.Message}");
			}
			catch (ArgumentException argex)
			{
				throw new Exception($"Token was invalid: {argex.Message}");
			}
		}

		

		/// <summary>
		/// Get userid from jwt token
		/// </summary>
		/// <param name="jwt">Raw Jwt string.</param>
   		/// <returns>user id value</returns>
		private string GetUserIDFromJwt(string jwt)
		{
			var jwtData = ValidateToken(jwt); // token from the id param
			var userid = jwtData.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
			return userid;
		}
	}
}
