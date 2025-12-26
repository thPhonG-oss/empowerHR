using AutoMapper;
using EmpowerHR.DTOs.Response;
using EmpowerHR.Models;

namespace EmpowerHR.Mappers
{
    public class EmployeeMappingProfile : Profile
    {
        public EmployeeMappingProfile()
        {
            // Mapping Employee -> EmployeeResponse
            CreateMap<Employee, EmployeeResponse>()
                .ForMember(dest => dest.PointBalance, opt => opt.MapFrom(src => src.PointAccount != null ? src.PointAccount.CurrentPoints : (long?)null))
                .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position != null ? src.Position.PositionName : null))
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department != null ? src.Department.DepartmentName : null))
                .ForMember(dest => dest.Bank, opt => opt.MapFrom(src => src.Bank != null ? src.Bank.BankName : null))
                .ForMember(dest => dest.BankAccountNumber, opt => opt.MapFrom(src => src.Bank != null ? src.Bank.BankAccountNumber : null));
        }
    }
}