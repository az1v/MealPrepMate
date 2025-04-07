import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  button {
    font-family: inherit;
  }
`;

export default GlobalStyle;