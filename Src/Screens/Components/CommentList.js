import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function CommentList({ comments }) {
  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUser}>{item.username || 'Kullanıcı'}:</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <FlatList
      data={comments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderCommentItem}
      ListEmptyComponent={<Text style={{ color: '#666' }}>Henüz yorum yapılmamış.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  commentItem: { paddingVertical: 5 },
  commentUser: { fontWeight: '600' },
});
