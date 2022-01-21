import React, {useRef} from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

const keyName = 'user';

type User = {
  name: string;
  age: number;
};

const userData1 = JSON.stringify({name: 'Samar Kalra', age: 24});
const userData2 = JSON.stringify({name: 'Kalra Samar', age: 42});

const App = () => {
  const webViewRef = useRef<WebView>(null);

  const injectJavaScriptString = `(function () {
    window.ReactNativeWebView.postMessage(
      window.sessionStorage.setItem('${keyName}', '${userData1}'),
    );
  })();`;

  // this is giving invalid JS error when called from onLoadStart
  const injectJavaScriptOnLoadStart = () => {
    webViewRef.current?.injectJavaScript(`(function () {
      window.ReactNativeWebView.postMessage(
        window.sessionStorage.setItem('${keyName}', '${userData1}'),
      );
    })();`);
  };

  const injectJavaScriptOnLoadEnd = () => {
    const script = `(function () {
      window.ReactNativeWebView.postMessage(
        window.sessionStorage.getItem('${keyName}'),
      );
    })();
    `;

    webViewRef.current?.injectJavaScript(script);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    const dataFromWebView: string | User | undefined = event.nativeEvent.data;
    if (dataFromWebView !== 'undefined') {
      const parsedData: User = JSON.parse(dataFromWebView);
      console.log(parsedData.name, parsedData.age);
    }
  };

  const onGetUserFromSessionStorageClick = () => {
    webViewRef.current?.injectJavaScript(
      `(function(){
           window.ReactNativeWebView.postMessage(window.sessionStorage.getItem('${keyName}'))
        })();`,
    );
  };

  const onUpdateNameClick = () => {
    webViewRef.current?.injectJavaScript(
      `(function () {
        window.ReactNativeWebView.postMessage(
          window.sessionStorage.setItem('${keyName}', '${userData2}'),
        );
      })();`,
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{uri: 'https://samarcodes.me'}}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={injectJavaScriptString}
        // onLoadStart={() => injectJavaScriptOnLoadStart()}
        onLoadEnd={() => injectJavaScriptOnLoadEnd()}
        onMessage={onMessage}
      />

      <View
        style={{
          width: '100%',
          borderRadius: 8,
        }}>
        <Button
          title="Get user from webview's session storage"
          color="#8E76DC"
          onPress={onGetUserFromSessionStorageClick}
        />
      </View>

      <View
        style={{
          width: '100%',
          borderRadius: 8,
          marginTop: 8,
        }}>
        <Button
          title="Update user in session storage"
          color="#8E76DC"
          onPress={onUpdateNameClick}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;
