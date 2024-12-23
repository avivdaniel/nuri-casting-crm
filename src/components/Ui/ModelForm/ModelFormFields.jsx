import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { Controller, useFormContext } from "react-hook-form";
import { CustomSelect, CustomCreatableSelect } from "../Select";
import { getBankBranches } from "../../../services";
import { PageHero } from "../index";
import { formConfig } from "./form-config";
import { iconsNames } from "../CardGroups/consts";

const ModelFormFields = ({ onSubmit, backLink, isLoading, modelId = null }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const watchBankNumber = watch("bank-bank_number", false);
  const [branchOptions, setBranchOptions] = useState([]);
  const [loadBranchOptions, setLoadBranchOptions] = useState(false);

  const handleGetBranchesOptions = () => {
    if (!watchBankNumber) return;
    setLoadBranchOptions(true);
    getBankBranches({
      bankNumber: watchBankNumber,
    })
      .then((res) => setBranchOptions(res))
      .finally(() => setLoadBranchOptions(false));
  };

  const watchPhone = watch("phone", "");
  const watchWhatsapp = watch("whatsapp", "");

  useEffect(() => {
    handleGetBranchesOptions();
  }, [watchBankNumber]);

  return (
    <>
      {!modelId && (
        <PageHero header="צור מיוצג חדש" icon={iconsNames.add_model} />
      )}
      <Segment loading={isLoading}>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          {formConfig.map(({ section: sectionName, groups }) => (
            <div key={sectionName}>
              <Header textAlign="right">{sectionName}</Header>
              {groups?.map(({ fields, id, widths = "equal" }) => (
                <Form.Group key={id} widths={widths}>
                  {fields.map((field) => (
                    <Form.Field
                      required={!!field?.validation?.required}
                      key={field.name}
                      error={!!errors[field.name]}
                    >
                      <label>{field.label}</label>
                      {field.type === "text" && (
                        <Controller
                          name={field.name}
                          control={control}
                          rules={{
                            ...field.validation,
                            validate:
                              field.name === "phone"
                                ? (value) => {
                                    if (watchWhatsapp && value) {
                                      return (
                                        value !== watchWhatsapp ||
                                        "מספר טלפון ומספר ווצאפ לא יכולים להיות זהים"
                                      );
                                    }
                                  }
                                : field.name === "whatsapp"
                                  ? (value) => {
                                      if (watchPhone && value) {
                                        return (
                                          value !== watchPhone ||
                                          "מספר טלפון ומספר ווצאפ לא יכולים להיות זהים"
                                        );
                                      }
                                      return true;
                                    }
                                  : undefined,
                          }}
                          render={({ field: inputProps }) => (
                            <Form.Input
                              {...inputProps}
                              placeholder={field.placeholder}
                              maxLength={field.maxLength}
                              onBlur={(e) => {
                                if (field.validation?.trimOnBlur) {
                                  setValue(field.name, e.target.value.trim());
                                }
                              }}
                            />
                          )}
                        />
                      )}
                      {field.type === "select" && (
                        <CustomSelect
                          {...field}
                          error={errors[field.name]}
                          label={undefined}
                          control={control}
                          rules={field.validation}
                        />
                      )}
                      {field.name === "bank-branch_number" && (
                        <CustomCreatableSelect
                          {...field}
                          label={undefined}
                          rules={field.validation}
                          error={errors[field.name]}
                          control={control}
                          isDisabled={!watchBankNumber}
                          isLoading={loadBranchOptions}
                          options={branchOptions}
                        />
                      )}
                      {errors[field.name] && (
                        <span
                          style={{ marginTop: "3px", display: "inline-block" }}
                        >
                          {errors[field.name].message}
                        </span>
                      )}
                    </Form.Field>
                  ))}
                </Form.Group>
              ))}
            </div>
          ))}
          <Button
            centered="true"
            color="green"
            style={{ margin: 0 }}
            loading={isLoading}
            disabled={isLoading}
          >
            שמור
          </Button>
          {!modelId && (
            <Button disabled={isLoading} color="red" as={Link} to={backLink}>
              ביטול
            </Button>
          )}
        </Form>
      </Segment>
    </>
  );
};

export default ModelFormFields;
