type ChipProps = {
  label: string;
  bgColor: string;
  txColor: string;
};

const StatusChip = ({ label, bgColor, txColor }: ChipProps) => (
  <span
    style={{
      backgroundColor: bgColor,
      padding: '7px 14px',
      borderRadius: '16px',
      fontWeight: 600,
      color: txColor,
      textAlign: 'center',
    }}
  >
    {label}
  </span>
);

export default StatusChip;
