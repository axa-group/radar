using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RadarTechno.Entities;
using RadarTechno.Technologies;
using RadarTechno.Users;
using RadarTechno.History;
using Microsoft.Extensions.Hosting;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

namespace RadarTechno
{
    [ExcludeFromCodeCoverage]
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            CurrentEnvironment = env;
        }

        public IConfiguration Configuration { get; }
        private IWebHostEnvironment CurrentEnvironment { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddControllers()
                .AddNewtonsoftJson();
            
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var connectionStringForNode = Configuration.GetSection("Connection:ConnectionString").Value;
            services.Configure<DatabaseSettings>(options =>
            {
                var split = connectionStringForNode.Split('/');
                var database = split[split.Length-1];
                options.ConnectionString = connectionStringForNode.Replace($"/{database}", "");
                options.Database = database.Split('?')[0];
            });
            
            services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(365);
            });

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = context =>
                        {
                            var userRepository =
                                context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
                            var userId = context.Principal.Identity.Name;
                            var user = userRepository.FindByIdAsync(userId);
                            user.Wait();
                            if (user.Result == null)
                            {
                                context.Fail("Unauthorized");
                            }
                            return Task.CompletedTask;
                        }
                    };
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            if (connectionStringForNode.Contains("ssl=true"))
            {
                services.AddSingleton<IRadarDatabase, SslRadarDatabase>();
            }
            else
            {
                services.AddSingleton<IRadarDatabase, RadarDatabase>();
            }
            services.AddTransient<ITechnologyRepository, TechnologyRepository>();
            services.AddTransient<IEntityRepository, EntityRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IHistoryRepository, HistoryRepository>();
            services.AddTransient<ITechnologyService, TechnologyService>();
            services.AddTransient<IEntityService, EntityService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<HistoryService, HistoryService>();
            services.AddSingleton<IQueue, Queue>();
            services.AddSingleton(Configuration);

            services.AddSwaggerDocument(config =>
            {
                config.PostProcess = document =>
                {
                    document.Info.Version = "v1";
                    document.Info.Title = "AXA Technology Radar API";
                    document.Info.Description = "API for the AXA Technology Radar";
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider)
        {
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                await next();
            });

            var queue = serviceProvider.GetService<IQueue>();
            var historyService = serviceProvider.GetService<HistoryService>();
            queue.SubscribeAsync("history", historyService.Callback);
            
            if (CurrentEnvironment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                var appSettings = serviceProvider.GetService<IOptions<AppSettings>>();
                if (appSettings.Value.HttpsOnly)
                {
                    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                    app.UseHsts();
                    app.UseHttpsRedirection();
                }
            }
            
            // Set up custom content types - associating file extension to MIME type
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".json"] = "application/json";
            
            if (!CurrentEnvironment.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseAuthentication();

            app.UseSwagger();
            app.UseSwaggerUi3();

            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (CurrentEnvironment.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
