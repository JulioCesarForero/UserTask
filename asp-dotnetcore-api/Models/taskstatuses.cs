
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("task_statuses", Schema = "dbo")]
	public class TaskStatuses : BaseRecord
	{
		public string status_name { get; set; } = default!;
		[Key]
		public int task_status_id { get; set; } = default!;

	}

	public class TaskstatusesAddDTO
	{
		[Required]
		public string status_name { get; set; } = default!;

	}

	public class TaskstatusesEditDTO
	{
		[RequiredIfEmpty]
		public string status_name { get; set; } = default!;

	}

}
