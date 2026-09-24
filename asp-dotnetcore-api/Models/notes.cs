
using ASPRad.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ASPRad.Models{
	[Table("notes", Schema = "dbo")]
	public class Notes : BaseRecord
	{
		public string related_entity_type { get; set; } = default!;
		public int related_entity_id { get; set; } = default!;
		public string? title { get; set; } = default!;
		public string content { get; set; } = default!;
		public int created_by { get; set; } = default!;
		public DateTime created_at { get; set; } = default!;
		[Key]
		public int note_id { get; set; } = default!;
		public DateTime? date_created { get; set; } = default!;
		public DateTime? date_updated { get; set; } = default!;

	}

	public class NotesAddDTO
	{
		[Required]
		public string related_entity_type { get; set; } = default!;
		[Required]
		public int related_entity_id { get; set; } = default!;
		public string? title { get; set; } = default!;
		[Required]
		public string content { get; set; } = default!;
		[Required]
		public int created_by { get; set; } = default!;

	}

	public class NotesEditDTO
	{
		[RequiredIfEmpty]
		public string related_entity_type { get; set; } = default!;
		[RequiredIfEmpty]
		public int related_entity_id { get; set; } = default!;
		public string? title { get; set; } = default!;
		[RequiredIfEmpty]
		public string content { get; set; } = default!;
		[RequiredIfEmpty]
		public int created_by { get; set; } = default!;

	}

}
