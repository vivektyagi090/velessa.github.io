FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["Velessa.API/Velessa.API.csproj", "Velessa.API/"]
COPY ["Velessa.Application/Velessa.Application.csproj", "Velessa.Application/"]
COPY ["Velessa.Domain/Velessa.Domain.csproj", "Velessa.Domain/"]
COPY ["Velessa.Infrastructure/Velessa.Infrastructure.csproj", "Velessa.Infrastructure/"]
RUN dotnet restore "Velessa.API/Velessa.API.csproj"

# Copy remaining source code and publish
COPY . .
WORKDIR "/src/Velessa.API"
RUN dotnet publish "Velessa.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Velessa.API.dll"]
