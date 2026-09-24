
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("tasks", Schema = "dbo")]
	public class Tasks : BaseRecord
	{
		public string title { get; set; } = default!;
		public string? description { get; set; } = default!;
		public string? related_entity_type { get; set; } = default!;
		public int? related_entity_id { get; set; } = default!;
		public int? assigned_user_id { get; set; } = default!;
		public int? priority_id { get; set; } = default!;
		public DateTime? due_date { get; set; } = default!;
		public int? task_status_id { get; set; } = default!;
		public DateTime? reminder_date { get; set; } = default!;
		public DateTime? completed_at { get; set; } = default!;
		public DateTime created_at { get; set; } = default!;
		public DateTime? updated_at { get; set; } = default!;
		[Key]
		public int task_id { get; set; } = default!;

	}

	public class TasksAddDTO
	{
		[Required]
		public string title { get; set; } = default!;
		public string? description { get; set; } = default!;
		public string? related_entity_type { get; set; } = default!;
		public int? related_entity_id { get; set; } = default!;
		public int? assigned_user_id { get; set; } = default!;
		public int? priority_id { get; set; } = default!;
		[DataType(DataType.Date)]
		public DateTime? due_date { get; set; } = default!;
		public int? task_status_id { get; set; } = default!;
		[DataType(DataType.Date)]
		public DateTime? reminder_date { get; set; } = default!;
		[DataType(DataType.Date)]
		public DateTime? completed_at { get; set; } = default!;

	}

	public class TasksEditDTO
	{
		[RequiredIfEmpty]
		public string title { get; set; } = default!;
		public string? description { get; set; } = default!;
		public string? related_entity_type { get; set; } = default!;
		public int? related_entity_id { get; set; } = default!;
		public int? assigned_user_id { get; set; } = default!;
		public int? priority_id { get; set; } = default!;
		[DataType(DataType.Date)]
		public DateTime? due_date { get; set; } = default!;
		public int? task_status_id { get; set; } = default!;
		[DataType(DataType.Date)]
		public DateTime? reminder_date { get; set; } = default!;
		[DataType(DataType.Date)]
		public DateTime? completed_at { get; set; } = default!;

	}

}
