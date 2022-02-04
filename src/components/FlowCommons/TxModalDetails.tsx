import { Trans } from '@lingui/macro';
import { FormControlLabel, Grid, GridProps, SvgIcon, Switch, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

import { FormInfo } from '../FormItems/FormInfo';
import { FormRow } from '../FormItems/FormRow';
import { FormValue } from '../FormItems/FormValue';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HealthFactorNumber } from '../HealthFactorNumber';
import { GasStation } from '../GasStation/GasStation';
import { parseUnits } from 'ethers/lib/utils';
import { IncentivesButton } from '../incentives/IncentivesButton';
import { ReserveIncentiveResponse } from 'src/hooks/app-data-provider/useIncentiveData';
import { CheckIcon } from '@heroicons/react/outline';
import { FormattedNumber } from '../primitives/FormattedNumber';

export interface TxModalDetailsProps extends GridProps {
  apy?: string;
  // supplyRewards: SupplyReward[];
  showHf?: boolean;
  healthFactor?: string;
  futureHealthFactor?: string;
  gasLimit?: string;
  incentives?: ReserveIncentiveResponse[];
  symbol?: string;
  usedAsCollateral?: boolean;
  setWithdrawUnWrapped?: Dispatch<SetStateAction<boolean>>;
}

export const TxModalDetails: React.FC<TxModalDetailsProps> = ({
  apy,
  showHf,
  healthFactor,
  futureHealthFactor,
  gasLimit,
  incentives,
  symbol,
  usedAsCollateral,
  setWithdrawUnWrapped,
  ...props
}) => {
  const [checked, setChecked] = React.useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    setChecked(event.target.checked);
    setWithdrawUnWrapped && setWithdrawUnWrapped(checked);
  };

  return (
    <Grid container direction="row" alignItems="center" rowSpacing={'12px'} {...props}>
      {setWithdrawUnWrapped && symbol && (
        <FormRow>
          <FormControlLabel
            value="darkmode"
            control={<Switch disableRipple checked={checked} onClick={handleChange} />}
            labelPlacement="end"
            label={''}
          />
          <Typography>{`Unwrap ${symbol} (to withdraw ${symbol.substring(1)})`}</Typography>
          <FormInfo />
        </FormRow>
      )}
      {apy && (
        <FormRow>
          <FormInfo>
            <Typography variant="description">
              <Trans>Supply APY</Trans>
            </Typography>
          </FormInfo>
          <FormValue>
            <FormattedNumber value={Number(apy)} percent variant="description" />
          </FormValue>
        </FormRow>
      )}
      {incentives && symbol && (
        <FormRow>
          <FormInfo>
            <Typography variant="description">
              <Trans>RewardsAPR</Trans>
            </Typography>
          </FormInfo>
          <FormValue>
            <IncentivesButton incentives={incentives} symbol={symbol} />
          </FormValue>
        </FormRow>
      )}
      {usedAsCollateral && (
        <FormRow>
          <FormInfo>
            <Typography variant="description">
              <Trans>Used as collateral</Trans>
            </Typography>
          </FormInfo>
          <FormValue sx={{ display: 'flex', flexDirection: 'row' }}>
            <SvgIcon sx={{ color: 'green' }}>
              <CheckIcon />
            </SvgIcon>
            <Typography variant="description" color={usedAsCollateral ? '#46BC4B' : '#00244D'}>
              <Trans>{usedAsCollateral ? 'Yes' : 'No'}</Trans>
            </Typography>
          </FormValue>
        </FormRow>
      )}
      {showHf && healthFactor && futureHealthFactor && (
        <FormRow>
          <FormInfo>
            <Typography variant="description">
              <Trans>Health factor</Trans>
            </Typography>
          </FormInfo>
          <FormValue>
            <Typography variant="secondary14">
              <HealthFactorNumber value={healthFactor} variant="secondary14" />
              <ArrowForwardIcon />
              <HealthFactorNumber
                value={Number(futureHealthFactor) ? futureHealthFactor : healthFactor}
                variant="secondary14"
              />
            </Typography>
            <Typography variant="helperText">
              <Trans>Liquidation at</Trans>
              {' <1.0'}
            </Typography>
          </FormValue>
        </FormRow>
      )}
      <FormRow>
        <FormInfo>
          <Typography variant="description">
            <Trans>Estimated Tx cost</Trans>
          </Typography>
        </FormInfo>
        {gasLimit && (
          <FormValue>
            <GasStation gasLimit={parseUnits(gasLimit, 'wei')} />
          </FormValue>
        )}
      </FormRow>
    </Grid>
  );
};
