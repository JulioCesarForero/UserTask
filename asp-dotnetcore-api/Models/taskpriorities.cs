
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("task_priorities", Schema = "dbo")]
	public class TaskPriorities : BaseRecord
	{
		public string priority_name { get; set; } = default!;
		[Key]
		public int priority_id { get; set; } = default!;

	}

	public class TaskprioritiesAddDTO
	{
		[Required]
		public string priority_name { get; set; } = default!;

	}

	public class TaskprioritiesEditDTO
	{
		[RequiredIfEmpty]
		public string priority_name { get; set; } = default!;

	}

}
