import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  HolidayForm,
  holidayValidator,
  upsertHoliday,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { setCustomFields } from "~/utils/form";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const formData = await request.formData();
  const validation = await validator(holidayValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, date } = validation.data;

  const createHoliday = await upsertHoliday(client, {
    name,
    date,
    createdBy: userId,
    customFields: setCustomFields(formData),
  });

  if (createHoliday.error) {
    throw redirect(
      path.to.holidays,
      await flash(
        request,
        error(createHoliday.error, "Failed to create holiday.")
      )
    );
  }

  throw redirect(
    path.to.holidays,
    await flash(request, success("Holiday created."))
  );
}

export default function NewHolidayRoute() {
  const initialValues = {
    name: "",
    date: "",
  };

  return <HolidayForm initialValues={initialValues} />;
}
