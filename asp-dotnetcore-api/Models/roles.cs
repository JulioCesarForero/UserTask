
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("roles", Schema = "dbo")]
	public class Roles : BaseRecord
	{
		[Key]
		public int role_id { get; set; } = default!;
		public string role_name { get; set; } = default!;

	}

	public class RolesAddDTO
	{
		[Required]
		public string role_name { get; set; } = default!;

	}

	public class RolesEditDTO
	{
		[RequiredIfEmpty]
		public string role_name { get; set; } = default!;

	}

}
