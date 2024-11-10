package com.swpproject.koi_care_system.service.subscribe;

import com.swpproject.koi_care_system.dto.SubscribePlanDto;
import com.swpproject.koi_care_system.models.Order;
import com.swpproject.koi_care_system.models.SubscribePlan;
import com.swpproject.koi_care_system.payload.request.UpgradePremiumRequest;

import java.util.List;

public interface ISubscribePlanService {
    SubscribePlan initDefault(Long userId);

    String upgradePremium(UpgradePremiumRequest request);

    List<SubscribePlanDto> getAllCustomer();

    void upgradePremiumAuto(Order order);


}
