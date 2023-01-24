import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteAttributeCategory } from "~/services/people";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    update: "people",
  });

  const { categoryId } = params;
  if (!categoryId) {
    return redirect(
      "/app/people/attributes",
      await flash(request, error(params, "Failed to get a category id"))
    );
  }

  const deactivateAttribute = await deleteAttributeCategory(client, categoryId);
  if (deactivateAttribute.error) {
    return redirect(
      "/app/people/attributes",
      await flash(
        request,
        error(
          deactivateAttribute.error,
          "Failed to deactivate attribute category"
        )
      )
    );
  }

  return redirect(
    "/app/people/attributes",
    await flash(request, success("Successfully deactivated attribute category"))
  );
}