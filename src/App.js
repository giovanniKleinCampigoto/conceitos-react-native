import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    getRepositories();
  }, []);

  async function getRepositories() {
    const { data: repositories } = await api.get("repositories");
    setRepositories(repositories);
  }

  async function handleLikeRepository(id) {
    const { data } = await api.post(`repositories/${id}/like`);

    const newRepositoryList = [...repositories];
    const repositoryIndex = repositories.findIndex((x) => x.id === id);
    newRepositoryList[repositoryIndex] = {
      ...newRepositoryList[repositoryIndex],
      likes: data.likes,
    };

    setRepositories(newRepositoryList);
  }

  function renderRepositoryItem({ title, techs, likes, id }) {
    return (
      <View key={id} style={styles.repositoryContainer}>
        <Text style={styles.repository}>{title}</Text>

        <FlatList
          style={styles.techsContainer}
          data={techs}
          keyExtractor={(tech) => `${tech}-${id}`}
          renderItem={({ item: tech }) => (
            <Text style={styles.tech}>{tech}</Text>
          )}
        />
        <View style={styles.likesContainer}>
          <Text style={styles.likeText} testID={`repository-likes-${id}`}>
            {likes} curtidas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(id)}
          testID={`like-button-${id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) =>
            renderRepositoryItem(repository)
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
