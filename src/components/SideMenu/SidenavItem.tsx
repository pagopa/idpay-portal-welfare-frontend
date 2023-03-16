import { ListItemButton, ListItemText, ListItemIcon, Icon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
  level: number;
  disabled?: boolean;
};

export default function SidenavItem({
  handleClick,
  title,
  isSelected,
  icon,
  level,
  disabled = false,
}: Props) {
  return (
    <ListItemButton selected={isSelected} disabled={disabled} onClick={handleClick}>
      <ListItemIcon sx={{ ml: level }}>
        <Icon component={icon} />
      </ListItemIcon>
      <ListItemText primary={title} sx={{ wordBreak: 'break-word' }} />
    </ListItemButton>
  );
}
