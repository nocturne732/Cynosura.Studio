using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MediatR;

namespace Cynosura.Studio.Core.Requests.EnumValues
{
    public class UpdateEnumValue : IRequest
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string DisplayName { get; set; }
        public int? Value { get; set; }
        public int? EnumId { get; set; }
    }
}