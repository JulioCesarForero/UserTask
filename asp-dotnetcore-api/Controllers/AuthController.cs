
namespace ASPRad.Controller{
using System;
using Microsoft.AspNetCore.Mvc;
	public class AuthController:Controller{
		public ActionResult index(){
			return NotFound("App authentication is not defined");
		}
	}
}
