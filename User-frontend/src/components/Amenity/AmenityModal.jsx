import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import * as api from '../../api/api';

const AmenityModal = ({ isOpen, onClose }) => {
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      fetchAmenities();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (selectedAmenity && selectedDate) {
      checkAvailability();
    } else {
      setIsAvailable(null);
    }
  }, [selectedAmenity, selectedDate]);
  
  const fetchAmenities = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAmenities();
      setAmenities(data);
      if (data.length > 0) {
        setSelectedAmenity(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch amenities:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkAvailability = async () => {
    if (!selectedAmenity || !selectedDate) return;
    
    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const available = await api.checkAmenityAvailability(selectedAmenity.id, dateStr);
      setIsAvailable(available);
    } catch (error) {
      console.error('Failed to check availability:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBooking = async () => {
    if (!selectedAmenity || !selectedDate || !isAvailable) return;
    
    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      await api.bookAmenity(selectedAmenity.id, dateStr, '10:00', '12:00');
      
      setSelectedDate(null);
      setIsAvailable(null);
      onClose();
    } catch (error) {
      console.error('Failed to book amenity:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="w-full max-w-md mx-auto bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-blue-100">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-bold text-navy-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-blue-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            return (
              <div
                key={day.toString()}
                className={`h-10 flex items-center justify-center rounded-full cursor-pointer text-sm 
                  ${isSelected 
                    ? 'bg-navy-900 text-white' 
                    : 'hover:bg-blue-100 text-navy-900'}`}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BOOK AMENITIES" width="lg">
      <div>
        <div className="mb-6">
          <h4 className="mb-2 font-medium">BOOK AMENITY:</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.map(amenity => (
              <button
                key={amenity.id}
                className={`px-4 py-2 rounded-md ${
                  selectedAmenity?.id === amenity.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-navy-900 hover:bg-blue-200'
                }`}
                onClick={() => setSelectedAmenity(amenity)}
              >
                {amenity.displayName}
              </button>
            ))}
          </div>
        </div>

        {renderCalendar()}

        <div className="mt-6 flex items-center justify-between">
          <div>
            <h4 className="font-medium">STATUS:</h4>
            <div className={`mt-1 px-4 py-2 rounded-md ${
              isAvailable === null
                ? 'bg-gray-100'
                : isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {isAvailable === null 
                ? 'Select a date'
                : isAvailable
                  ? 'AVAILABLE'
                  : 'NOT AVAILABLE'
              }
            </div>
          </div>

          <Button
            onClick={handleBooking}
            disabled={!selectedAmenity || !selectedDate || !isAvailable || isLoading}
          >
            BOOK NOW
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AmenityModal;