export const mockedPermission = [
  {
    permission: {
      name: '',
      description: '',
      mode: '',
    },
    role: '',
  },
  {
    permission: {
      name: '',
      description: '',
      mode: '',
    },
    role: '',
  },
];
export const getUserPermission = () => new Promise((resolve) => resolve(mockedPermission));
