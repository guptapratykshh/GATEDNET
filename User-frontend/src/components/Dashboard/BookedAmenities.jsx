import React, { useEffect } from 'react';
import Card from '../UI/Card';
import useStore from '../../store/useStore';

const BookedAmenities = ({ onBookAmenity }) => {
  const { amenityBookings, fetchAmenityBookings, isLoading } = useStore();
  
  useEffect(() => {
    fetchAmenityBookings();
  }, [fetchAmenityBookings]);
  
  // Get amenity name by ID (in a real app, you would have a more robust data structure)
  const getAmenityName = (amenityId) => {
    const amenityNames = {
      '1': 'Clubhouse',
      '2': 'Swimming Pool',
      '3': 'Amphitheatre',
      '4': 'Garden',
      '5': 'Kids Pool',
    };
    
    return amenityNames[amenityId] || 'Unknown';
  };
  
  return (
    <Card 
      title="BOOKED AMENITIES"
      footer={<span onClick={onBookAmenity}>SEE ALL BOOKINGS</span>}
    >
      {isLoading ? (
        <div className="text-center py-4">Loading bookings...</div>
      ) : amenityBookings.length === 0 ? (
        <div className="text-center py-4">No booked amenities</div>
      ) : (
        <div className="space-y-2">
          {amenityBookings.map(booking => (
            <div key={booking.id} className="flex justify-between">
              <div className="text-lg">{booking.date.split('-')[1] + ' ' + booking.date.split('-')[2]}</div>
              <div className="text-lg text-right">{getAmenityName(booking.amenityId)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default BookedAmenities;