import cron from "node-cron";
import { Subscription } from "../models/subscriptionModel.js";
import { Tender } from "../models/tenderModel.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const expiredSubscriptions = await Subscription.find({
      dateFin: { $lt: new Date() },
      status: "updated",
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = "expired";
      await subscription.save();
    }

    console.log("Vérification des abonnements expirés effectuée.");

    // 2. Suppression des tenders expirés de plus d'un an
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const deletedTenders = await Tender.deleteMany({
      dateEchehance: { $lt: oneYearAgo },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des abonnements expirés:",
      error
    );
  }
});
