using System.Collections.Generic;

namespace EmpowerHR.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string Name { get; set; }

        // Navigation Properties
        public ICollection<Permission> Permissions { get; set; } = new List<Permission>();
    }
}