import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function StarRating({ currentRating, onRate, disabled }) {
  return (
    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate(star)}
          disabled={disabled}
        >
          <Text style={{
            fontSize: 24,
            color: star <= currentRating ? '#6f4e37' : '#ccc'
          }}>
            {star <= currentRating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
