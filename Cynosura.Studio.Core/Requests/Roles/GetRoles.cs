using Cynosura.Core.Services.Models;
using Cynosura.Studio.Core.Requests.Roles.Models;
using MediatR;

namespace Cynosura.Studio.Core.Requests.Roles
{
    public class GetRoles : IRequest<PageModel<RoleModel>>
    {
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; }
    }
}