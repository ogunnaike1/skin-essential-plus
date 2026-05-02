import type { Service } from './services-api-public';
import type { ServiceItem } from '@/types';

/**
 * Transform database Service to frontend ServiceItem format
 * Maps the simplified database schema to the rich frontend interface
 */
export function transformServiceToItem(service: Service): ServiceItem {
  // Map database category to category ID for frontend
  const categoryMap: Record<string, string> = {
    'Pedicure Treatment': 'pedicure',
    'Advanced Facial': 'advanced-facial',
    'Skin Treatment': 'skin-treatment',
    'Massage': 'massage',
    'Lash Extension': 'lash-extension',
    'Semi Permanent Brows': 'semi-permanent-brows',
    'Facial Treatment': 'facial-treatment',
    'Skin IV Drips': 'iv-drips',
    'Tattoo Removal': 'tattoo-removal',
    'PRP Stretch Mark Treatment': 'prp-stretch',
    'Body Enhancement': 'body-enhancement',
    'Face Waxing': 'face-waxing',
    'Bikini & Brazilian Waxing': 'bikini-waxing',
    'Body Waxing': 'body-waxing',
    'Teeth Whitening': 'teeth-whitening',
  };

  const categoryId = categoryMap[service.category] || service.category.toLowerCase().replace(/\s+/g, '-');

  return {
    id: service.id,
    categoryId: categoryId,
    name: service.name,
    tag: 'Service', // Default tag, can be customized
    description: service.description,
    price: service.price,
    durationMinutes: service.duration,
    slotsTotal: 10, // Default values
    slotsAvailable: 8, // Default values
    location: 'Main Studio', // Default location
    rating: 4.8, // Default rating
    reviewCount: 0, // Default review count
    image: service.image_url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop',
    employeeIds: [], // No employee mapping yet
    popular: false, // Can be determined by other factors
    isNew: false, // Can be determined by created_at
  };
}

/**
 * Transform array of Services to ServiceItems
 */
export function transformServicesToItems(services: Service[]): ServiceItem[] {
  return services.map(transformServiceToItem);
}

/**
 * Get category name from category ID
 */
export function getCategoryNameFromId(categoryId: string): string {
  const nameMap: Record<string, string> = {
    'pedicure': 'Pedicure Treatment',
    'advanced-facial': 'Advanced Facial',
    'skin-treatment': 'Skin Treatment',
    'massage': 'Massage',
    'lash-extension': 'Lash Extension',
    'semi-permanent-brows': 'Semi Permanent Brows',
    'facial-treatment': 'Facial Treatment',
    'iv-drips': 'Skin IV Drips',
    'tattoo-removal': 'Tattoo Removal',
    'prp-stretch': 'PRP Stretch Mark Treatment',
    'body-enhancement': 'Body Enhancement',
    'face-waxing': 'Face Waxing',
    'bikini-waxing': 'Bikini & Brazilian Waxing',
    'body-waxing': 'Body Waxing',
    'teeth-whitening': 'Teeth Whitening',
  };

  return nameMap[categoryId] || categoryId;
}