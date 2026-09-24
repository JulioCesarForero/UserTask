
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("sysdiagrams", Schema = "dbo")]
	public class Sysdiagrams : BaseRecord
	{
		public string name { get; set; } = default!;
		public int principal_id { get; set; } = default!;
		public int? version { get; set; } = default!;
		[NotMapped]
		public byte[]? definition { get; set; } = default!;
		[Key]
		public int diagram_id { get; set; } = default!;

	}

	public class SysdiagramsAddDTO
	{
		[Required]
		public string name { get; set; } = default!;
		[Required]
		public int principal_id { get; set; } = default!;
		public int? version { get; set; } = default!;
		public string? definition { get; set; } = default!;

	}

	public class SysdiagramsEditDTO
	{
		[RequiredIfEmpty]
		public string name { get; set; } = default!;
		[RequiredIfEmpty]
		public int principal_id { get; set; } = default!;
		public int? version { get; set; } = default!;
		public string? definition { get; set; } = default!;

	}

}
