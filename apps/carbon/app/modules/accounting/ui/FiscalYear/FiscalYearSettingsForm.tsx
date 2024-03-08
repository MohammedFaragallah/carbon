import { VStack } from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import type { z } from "zod";
import { Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import { fiscalYearSettingsValidator } from "~/modules/accounting";
import { months } from "~/modules/shared";
import { path } from "~/utils/path";

type FiscalYearSettingsFormProps = {
  initialValues: z.infer<typeof fiscalYearSettingsValidator>;
};

const FiscalYearSettingsForm = ({
  initialValues,
}: FiscalYearSettingsFormProps) => {
  const permissions = usePermissions();
  return (
    <div className="w-full">
      <ValidatedForm
        method="post"
        action={path.to.fiscalYears}
        defaultValues={initialValues}
        validator={fiscalYearSettingsValidator}
      >
        <VStack spacing={4} className="my-4 w-full max-w-[440px]">
          <Select
            name="startMonth"
            label="Start of Fiscal Year"
            options={months.map((month) => ({ label: month, value: month }))}
            helperText="This is the month your fiscal year starts."
          />
          <Select
            name="taxStartMonth"
            label="Start of Tax Year"
            options={months.map((month) => ({ label: month, value: month }))}
            helperText="This is the month your tax year starts."
          />
          <Submit
            isDisabled={
              !permissions.can("update", "accounting") ||
              !permissions.is("employee")
            }
          >
            Save
          </Submit>
        </VStack>
      </ValidatedForm>
    </div>
  );
};

export default FiscalYearSettingsForm;
