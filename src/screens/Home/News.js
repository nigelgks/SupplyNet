import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';

const News = () => {
  return (
    <View>
      <ImageBackground
        source={require('../../../assets/construction.jpg')}
        style={styles.imageLayout}
        imageStyle={{borderRadius: 40}}
      />
      <Text style={styles.text1}>Watch this space!</Text>
      <Text style={styles.text2}>News page is printing.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageLayout: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 100
  },
  text1: {
    paddingTop: 25,
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: '600'
  },
  text2: {
    paddingTop: 10,
    alignSelf: 'center',
    fontSize: 19,
    fontWeight: '300'
  }
});

export default News;