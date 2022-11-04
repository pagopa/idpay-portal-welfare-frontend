export interface InitiativeUser {
  beneficiary: string;
  updateStatusDate: Date | string;
  beneficiaryState: string;
}

export interface InitiativeUserToDisplay {
  id: number;
  beneficiary: string;
  updateStatusDate: string;
  beneficiaryState: string;
}

export interface InitiativeUsersResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  oggetti: Array<InitiativeUser>;
}

export const mockedInitiativeUsersPage1 = {
  pageNo: 1,
  pageSize: 15,
  totalElements: 30,
  totalPages: 2,
  oggetti: [
    {
      beneficiary: 'AOISFN73R54B745Z',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAAHMD77P30Z330S',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAAMRO82C23Z330C',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEBNR90E20Z216W',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEKKK44D42Z219I',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEKSR79L06Z249S',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEMRD84E66Z216B',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAICLD60M12F205M',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICLD79L54A089Y',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICNH82A02Z210D',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICNL90L30Z129Z',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICRI60R13F839M',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIDNL73C60E202V',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIGNE51S23F465N',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIGPP69L63A064W',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
  ],
};

export const mockedInitiativeUsersPage2 = {
  pageNo: 2,
  pageSize: 15,
  totalElements: 30,
  totalPages: 2,
  oggetti: [
    {
      beneficiary: 'BAIGRG96R70H501Y',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIHNN88T51Z330L',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIHSN70S23Z352B',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAILRA61S60I625H',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMLB77D52F912F',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMNC71A64L157Q',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMRA46M10H537K',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMRC53L56G972Q',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRK76P01H501R',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRK76P01H501R',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRO63S13E152B',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRS68B49H501V',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMTF79D04Z240X',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAINRN76H11F205N',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAINTN66B06F895L',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
  ],
};

export const fetchInitiativeUsers = (page: number) => {
  if (page === 0) {
    return new Promise<InitiativeUsersResponse>((resolve) => resolve(mockedInitiativeUsersPage1));
  } else {
    return new Promise<InitiativeUsersResponse>((resolve) => resolve(mockedInitiativeUsersPage2));
  }
};
