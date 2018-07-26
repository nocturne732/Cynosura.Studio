using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Cynosura.Core.Data;
using Cynosura.Core.Services.Models;
using Cynosura.Studio.Core.Entities;
using Cynosura.Studio.Core.Services.Models;

namespace Cynosura.Studio.Core.Services
{
    public class EntityService : IEntityService
    {
        private readonly ISolutionService _solutionService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EntityService(ISolutionService solutionService,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _solutionService = solutionService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Entity> GetEntityAsync(int solutionId, Guid id)
        {
            var entities = await GetEntitiesAsync(solutionId);
            return entities.PageItems
                .FirstOrDefault(e => e.Id == id);
        }

        private List<Entity> GetEntitiesFromSolution(string path)
        {
            var solution = new Generator.Models.Solution(path);
            return solution.GetEntities();
        }

        private static PageModel<T> ToPageModel<T>(IList<T> list, int? pageIndex = null, int? pageSize = null)
        {
            if (pageIndex != null && pageSize != null)
            {
                var pageList = list.Skip(pageIndex.Value * pageSize.Value)
                    .Take(pageSize.Value)
                    .ToList();
                return new PageModel<T>(pageList, list.Count, pageIndex.Value);
            }
            else
            {
                return new PageModel<T>(list, list.Count, 0);
            }
        }

        public async Task<PageModel<Entity> > GetEntitiesAsync(int solutionId, int? pageIndex = null, int? pageSize = null)
        {
            var solution = await _solutionService.GetSolutionAsync(solutionId);
            var entities = GetEntitiesFromSolution(solution.Path);
            return ToPageModel(entities, pageIndex, pageSize);
        }

        public async Task<Guid> CreateEntityAsync(int solutionId, EntityCreateModel model)
        {
            return Guid.NewGuid();
        }

        public async Task UpdateEntityAsync(int solutionId, Guid id, EntityUpdateModel model)
        {
            
        }

        public async Task DeleteEntityAsync(int solutionId, Guid id)
        {
            
        }
    }
}
