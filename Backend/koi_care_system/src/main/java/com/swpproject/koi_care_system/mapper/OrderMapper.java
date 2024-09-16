import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.models.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    // Define the method to convert Order to OrderDto
    OrderDto toDto(Order order);

    // You can also add reverse mapping if needed (optional)
    Order toEntity(OrderDto orderDto);
}
