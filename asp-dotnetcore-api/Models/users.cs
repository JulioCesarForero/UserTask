
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("users", Schema = "dbo")]
	public class Users : BaseRecord
	{
		public string? title { get; set; } = default!;
		public string first_name { get; set; } = default!;
		public string last_name { get; set; } = default!;
		public string email { get; set; } = default!;
		public string? phone { get; set; } = default!;
		public string username { get; set; } = default!;
		[Key]
		public int user_id { get; set; } = default!;
		public string password { get; set; } = default!;
	}

	public class UsersRegisterDTO
	{
		[RecordUnique("email", "users")]
		[Required]
		[EmailAddress]
		public string email { get; set; } = default!;
		public string? phone { get; set; } = default!;
		[RecordUnique("username", "users")]
		[Required]
		public string username { get; set; } = default!;
		[Required]
		public string password { get; set; } = default!;

		[Compare("password")]
		[NotMapped]
		public string Confirm_Password { get; set; } = default!;

	}

	public class UsersAccounteditDTO
	{
		public string? title { get; set; } = default!;
		[RequiredIfEmpty]
		public string first_name { get; set; } = default!;
		[RequiredIfEmpty]
		public string last_name { get; set; } = default!;
		public string? phone { get; set; } = default!;
		[RequiredIfEmpty]
		public string username { get; set; } = default!;

	}

	public class UsersAddDTO
	{
		[RecordUnique("email", "users")]
		[Required]
		[EmailAddress]
		public string email { get; set; } = default!;
		public string? phone { get; set; } = default!;
		[RecordUnique("username", "users")]
		[Required]
		public string username { get; set; } = default!;
		[Required]
		public string password { get; set; } = default!;

		[Compare("password")]
		[NotMapped]
		public string Confirm_Password { get; set; } = default!;

	}

	public class UsersEditDTO
	{
		public string? title { get; set; } = default!;
		[RequiredIfEmpty]
		public string first_name { get; set; } = default!;
		[RequiredIfEmpty]
		public string last_name { get; set; } = default!;
		public string? phone { get; set; } = default!;
		[RequiredIfEmpty]
		public string username { get; set; } = default!;

	}

}
