import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import PeppyImage from '../atoms/PeppyImage';
import ChatBubble from '../molecules/ChatBubble';

export default function PageLayout({ children, message = "Hey there!" }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PeppyImage />
        <View style={styles.chatContainer}>
          <ChatBubble message={message} />
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  chatContainer: {
    position: 'absolute',
    top: 135,
    left: 100,
    zIndex: 100,
  },
});
