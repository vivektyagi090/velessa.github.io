using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Velessa.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLastLoginAtUtcToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAtUtc",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginAtUtc",
                table: "Users");
        }
    }
}
