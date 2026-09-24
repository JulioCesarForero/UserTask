using AutoMapper;
using ASPRad.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System;



var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:8060");
builder.Services.AddControllers().AddNewtonsoftJson();


builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();

// Auto Mapper Configurations
var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new AutoMapping());
});

IMapper mapper = mapperConfig.CreateMapper();

builder.Services.AddSingleton(mapper);
builder.Services.AddTransient<EmailHelper>();





string ConStr = builder.Configuration.GetConnectionString("DefaultConnectionString");
builder.Services.AddDbContext<AppDBContext>(options =>
	options.UseSqlServer(ConStr)
);


builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());


app.MapControllerRoute(name: "default", pattern: "api/{controller=Home}/{action=Index}/{id?}");
app.MapControllerRoute(name: "listfilter", pattern: "api/{controller=Home}/{action=Index}/{fieldname}/{fieldvalue}");

app.Run();
