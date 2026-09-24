
namespace ASPRad.Controller{
	using System;
	using Microsoft.AspNetCore.Mvc;
	public class AccountController:Controller{
		public ActionResult Index(){
			return NotFound("App account is not defined");
		}
	}
}
