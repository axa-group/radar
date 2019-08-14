FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
# End setup
WORKDIR /src
COPY ["src/RadarTechno/RadarTechno.csproj", "src/RadarTechno/"]
RUN dotnet restore "src/RadarTechno/RadarTechno.csproj"
COPY . .
WORKDIR "/src/src/RadarTechno"
RUN dotnet build "RadarTechno.csproj" -c Release -o /app
WORKDIR "/src/src/RadarTechno/ClientApp"
# Install Node.js
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y build-essential nodejs
RUN npm install npm@latest -g
RUN npm cache clean --force
RUN npm install
RUN npm run build
RUN dotnet dev-certs https

WORKDIR "/src/src/RadarTechno"
FROM build AS publish
RUN dotnet publish "RadarTechno.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "RadarTechno.dll"]
