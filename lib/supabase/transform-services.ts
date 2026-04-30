import type { Service } from './types';
import type { ServiceItem } from '@/types';


/**
 * Transform Supabase Service to frontend ServiceItem format
 */
export function transformServiceToItem(service: Service): ServiceItem {
  return {
    id: service.id,
    name: service.name,
    categoryId: service.category_id,
    description: service.description,
    price: service.price,
    durationMinutes: service.duration_minutes,
    image: service.image_url || '/images/services/default.jpg',
    tag: service.tag || '',
    slotsAvailable: service.slots_available,
    slotsTotal: service.slots_available, // Use same as available for now
    location: service.location,
    rating: 4.8, // Default rating - TODO: implement actual ratings system
    reviewCount: 0, // Default - TODO: implement reviews
    employeeIds: [], // Default - TODO: link services to staff
  };
}

/**
 * Transform array of Supabase Services to frontend ServiceItems
 */
export function transformServicesToItems(services: Service[]): ServiceItem[] {
  return services.map(transformServiceToItem);
}