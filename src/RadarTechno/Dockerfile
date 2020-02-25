FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
COPY docker/certificates/ /usr/local/share/ca-certificates/
RUN chmod -R 644 /usr/local/share/ca-certificates/
RUN update-ca-certificates

WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
COPY docker/certificates/ /usr/local/share/ca-certificates/
RUN chmod -R 644 /usr/local/share/ca-certificates/
RUN update-ca-certificates
COPY docker/nuget .
WORKDIR /src
COPY ["src/RadarTechno/RadarTechno.csproj", "src/RadarTechno/"]
RUN dotnet restore "src/RadarTechno/RadarTechno.csproj"
COPY . .
WORKDIR "/src/src/RadarTechno"
RUN dotnet build "RadarTechno.csproj" -c Release -o /app
WORKDIR "/src/src/RadarTechno/ClientApp"
# Install Node.js
COPY docker/apt /etc/apt
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y build-essential nodejs npm
RUN node -v 
RUN npm -v

COPY docker/npm /root
RUN npm config list
RUN npm install npm@latest -g 
RUN npm install
RUN npm run build

WORKDIR "/src/src/RadarTechno"
FROM build AS publish
RUN dotnet publish "RadarTechno.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "RadarTechno.dll"]
