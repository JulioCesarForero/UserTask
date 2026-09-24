
// AutoMapping.cs
using AutoMapper;
using ASPRad.Models;
public class AutoMapping : Profile
{
    public AutoMapping()
    {
    		CreateMap<NotesAddDTO, Notes>();
		CreateMap<NotesEditDTO, Notes>();
		CreateMap<TaskprioritiesAddDTO, TaskPriorities>();
		CreateMap<TaskprioritiesEditDTO, TaskPriorities>();
		CreateMap<TasksAddDTO, Tasks>();
		CreateMap<TasksEditDTO, Tasks>();
		CreateMap<TaskstatusesAddDTO, TaskStatuses>();
		CreateMap<TaskstatusesEditDTO, TaskStatuses>();
		CreateMap<UsersRegisterDTO, Users>();
		CreateMap<UsersAccounteditDTO, Users>();
		CreateMap<UsersAddDTO, Users>();
		CreateMap<UsersEditDTO, Users>();
    }
}
