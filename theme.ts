import { extendTheme } from 'native-base';

export default extendTheme({
  components: {
    Button: {
      variants: {
        solid: {
          bg: '#71d3fb',
          _text: {
            color: '#000',
          },
        },
      },
    },
    ModalHeader: {
      baseStyle: {
        py: '3',
        pl: '3',
        pr: 12,
        backgroundColor: '#284985',
        borderBottomWidth: 0,
        _text: {
          color: '#58cdff',
        },
      },
    },
    ModalBody: {
      baseStyle: {
        _text: {
          color: 'white',
        },
      },
    },
    ModalContent: {
      baseStyle: {
        backgroundColor: 'hsla(0,0%,100%,.3)',
        rounded: 'sm',
      },
    },
    ModalFooter: {
      baseStyle: {
        backgroundColor: 'hsla(0,0%,100%,.3)',
      },
    },
  },
});
