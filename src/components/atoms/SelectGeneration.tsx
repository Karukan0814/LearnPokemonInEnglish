import { memo } from "react";
import { generationSet } from "../../common/define";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";

type Props = {
  generation: string;
  handleChange: (event: SelectChangeEvent) => void;
};
export const SelectGeneration = memo((props: Props) => {
  const { generation, handleChange } = props;
  return (
    <Box sx={{ width: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="select-generation-label">Generation</InputLabel>
        <Select
          labelId="select-generation-label"
          id="select-generation"
          value={generation}
          onChange={handleChange}
          displayEmpty={true}
        >
          {generationSet.map((generation) => {
            return (
              <MenuItem key={generation.id} value={generation.id}>
                {generation.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
});
