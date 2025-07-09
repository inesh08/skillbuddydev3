import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '../components/AnimatedBackground';
import apiService from '../services/apiService';

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostInput, setShowNewPostInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await apiService.getCommunityPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load community posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post.');
      return;
    }

    try {
      await apiService.createCommunityPost(newPostContent.trim());
      setNewPostContent('');
      setShowNewPostInput(false);
      loadPosts(); // Refresh posts
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await apiService.likeCommunityPost(postId);
      loadPosts(); // Refresh posts to update like count
    } catch (error) {
      console.error('Failed to like post:', error);
      Alert.alert('Error', 'Failed to like post. Please try again.');
    }
  };

  const handleReply = async (postId) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply.');
      return;
    }

    try {
      await apiService.replyToCommunityPost(postId, replyText.trim());
      setReplyText('');
      setReplyingTo(null);
      loadPosts(); // Refresh posts to show new reply
      Alert.alert('Success', 'Reply posted successfully!');
    } catch (error) {
      console.error('Failed to reply:', error);
      Alert.alert('Error', 'Failed to post reply. Please try again.');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderPost = (post) => (
    <View key={post.post_id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.postTimestamp}>{formatTimestamp(post.timestamp)}</Text>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikePost(post.post_id)}
        >
          <Ionicons name="heart-outline" size={20} color="#00ff00" />
          <Text style={styles.actionText}>{post.like_count || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setReplyingTo(replyingTo === post.post_id ? null : post.post_id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#00ff00" />
          <Text style={styles.actionText}>{post.reply_count || 0}</Text>
        </TouchableOpacity>
      </View>

      {/* Reply Input */}
      {replyingTo === post.post_id && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            placeholderTextColor="#666"
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => handleReply(post.post_id)}
            >
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Replies */}
      {post.replies && post.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {post.replies.map((reply, index) => (
            <View key={reply.reply_id || index} style={styles.replyCard}>
              <Text style={styles.replyText}>{reply.text}</Text>
              <Text style={styles.replyTimestamp}>{formatTimestamp(reply.timestamp)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AnimatedBackground intensity="medium" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.loadingText}>Loading community posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground intensity="medium" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#00ff00" />
        </TouchableOpacity>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => setShowNewPostInput(!showNewPostInput)}
        >
          <Ionicons name="add" size={24} color="#00ff00" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* New Post Input */}
        {showNewPostInput && (
          <View style={styles.newPostContainer}>
            <TextInput
              style={styles.newPostInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#666"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={4}
            />
            <View style={styles.newPostActions}>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowNewPostInput(false);
                  setNewPostContent('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share something!</Text>
          </View>
        ) : (
          posts.map(renderPost)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00ff00',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    color: '#00ff00',
    fontWeight: '600',
  },
  newPostButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  newPostContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  newPostInput: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 10,
  },
  postButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  postButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 16,
    marginTop: 5,
  },
  postCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  postHeader: {
    marginBottom: 10,
  },
  postTimestamp: {
    color: '#666',
    fontSize: 12,
  },
  postContent: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#00ff00',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  replyInput: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  replyButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  replyButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  repliesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  replyCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  replyText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  replyTimestamp: {
    color: '#666',
    fontSize: 12,
  },
}); 