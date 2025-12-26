using System;
using System.Collections.Generic;

namespace EmpowerHR.Models
{
    public class Account
    {
        public int AccountId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool AccountStatus { get; set; }

        // Navigation Properties
        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}