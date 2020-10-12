using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace RadarTechno
{
    [ExcludeFromCodeCoverage]
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .ConfigureAppConfiguration((context, config) =>
                {
                    var contextHostingEnvironment = context.HostingEnvironment;
                    if (contextHostingEnvironment.IsDevelopment() ||
                        contextHostingEnvironment.EnvironmentName == "Docker") return;

                    var builtConfig = config.Build();
                    if (string.IsNullOrWhiteSpace(builtConfig["KeyVault:BaseUrl"]))
                    {
                        var keyVaultConfigBuilder = new ConfigurationBuilder();
                        keyVaultConfigBuilder.AddAzureKeyVault(builtConfig["KeyVault:BaseUrl"]);
                        var keyVaultConfig = keyVaultConfigBuilder.Build();
                        config.AddConfiguration(keyVaultConfig);
                    }
                });
        }
    }
}